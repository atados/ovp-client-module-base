import nanoid from "nanoid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import useTriggerableFetchApi from "~/hooks/use-trigglerable-fetch-api";
import { fetchAPI } from "~/lib/fetch/fetch.client";
import { Project, updateProject } from "~/redux/ducks/project";
import { User } from "~/redux/ducks/user";
import { RootState } from "~/redux/root-reducer";
import { DocumentDict } from "~/types/api";
import ActivityIndicator from "../ActivityIndicator";
import Icon from "../Icon";
import { defineMessages } from "react-intl";
import useIntl from "~/hooks/use-intl";

const PlaceholderIcon = styled(Icon)`
  font-size: 64px;
  color: #999;
`;

const Item = styled.div`
  padding-right: 64px;
`;

const ButtonRemove = styled.button`
  position: absolute;
  right: 1rem;
  top: 0;
  bottom: 0;
  border-radius: 50%;
  height: 24px;
  width: 24px;
  padding: 0;
  margin: auto;
  background: #ccc;
  border-color: #ccc;
`;

interface DocumentItem {
  id: string | number;
  isDraft?: boolean;
  uploading?: boolean;
  removed?: boolean;
  document?: DocumentDict;
}

interface ProjectManagePageDocumentsProps {
  readonly className?: string;
  readonly project: Project;
  readonly onUpdateProject: (
    changes: Partial<Project> & { slug: string }
  ) => any;
  readonly viewer: User;
}

interface ProjectManagePagePhotosState {
  items: DocumentItem[];
}

const {
  CANCELAR,
  SALVAR,
  DOCUMENTOS,
  DOCUMENTOS_DA_VAGA,
  DOCUMENTOS_HINT,
  ADICIONAR,
  ARQUIVO,
  CARREGANDO,
  NOVO,
  ADICIONAR_DOCUMENTOS
} = defineMessages({
  CANCELAR: {
    id: "CANCELAR",
    defaultMessage: "Cancelar"
  },
  SALVAR: {
    id: "SALVAR",
    defaultMessage: "Salvar alterações"
  },
  DOCUMENTOS: {
    id: "DOCUMENTOS",
    defaultMessage: "Documentos"
  },
  DOCUMENTOS_DA_VAGA: {
    id: "DOCUMENTOS_DA_VAGA",
    defaultMessage: "Documentos da vaga"
  },
  DOCUMENTOS_HINT: {
    id: "DOCUMENTOS_HINT",
    defaultMessage:
      "Aqui você pode adicionar arquivos que vão ficar disponibilizados na vaga."
  },
  ADICIONAR: {
    id: "ADICIONAR",
    defaultMessage: "Adicionar documentos"
  },
  ARQUIVO: {
    id: "ARQUIVO",
    defaultMessage: "Arquivo"
  },
  CARREGANDO: {
    id: "CARREGANDO",
    defaultMessage: "Carregando..."
  },
  NOVO: {
    id: "NOVO",
    defaultMessage: "NOVO"
  },
  ADICIONAR_DOCUMENTOS: {
    id: "ADICIONAR_DOCUMENTOS",
    defaultMessage: "Adicionar documentos"
  }
});

const ProjectManagePageDocuments: React.FC<ProjectManagePageDocumentsProps> = ({
  className,
  project,
  viewer,
  onUpdateProject
}) => {
  const intl = useIntl();

  const initialItems = useMemo(() => {
    return project.documents
      ? project.documents.map(document => ({ id: document.id, document }))
      : [];
  }, [project]);
  const [state, setState] = useState<ProjectManagePagePhotosState>(() => ({
    items: initialItems
  }));
  useEffect(() => {
    if (initialItems !== state.items) {
      setState({ items: initialItems });
    }
  }, [initialItems]);
  const onCancelEdition = useCallback(() => {
    setState({
      items: initialItems
    });
  }, [project, setState, initialItems]);
  const hasDocuments = state.items.length > 0;
  const handleInputFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      if (!files) {
        return;
      }

      const promises: Array<Promise<DocumentDict>> = [];
      const newItems: DocumentItem[] = [];
      Array.from(files).map(file => {
        const formData = new FormData();
        formData.append("document", file);

        const id = nanoid();
        newItems.push({
          id,
          isDraft: true,
          uploading: true
        });

        promises.push(
          fetchAPI("/uploads/documents/", {
            method: "POST",
            body: formData,
            sessionToken: viewer.token
          })
        );
      });

      setState(prevState => ({
        ...prevState,
        items: [...prevState.items, ...newItems]
      }));

      const payloads = await Promise.all(promises);
      const newItemsIds = newItems.map(item => item.id);

      setState(prevState => ({
        ...prevState,
        items: prevState.items.map(item => {
          const index = newItemsIds.indexOf(item.id);
          if (index !== -1) {
            return {
              ...item,
              uploading: false,
              document: payloads[index]
            };
          }

          return item;
        })
      }));
    },
    []
  );
  const updateProjectTrigger = useTriggerableFetchApi(
    `/projects/${project.slug}/`,
    {
      method: "PATCH"
    }
  );

  const [isDrafting, isUploading] = useMemo(() => {
    let drafting = false;
    let uploading = false;
    state.items.some(item => {
      if (!drafting) {
        drafting = Boolean(item.isDraft) || Boolean(item.removed);
      }
      if (!uploading) {
        uploading = Boolean(item.uploading);
      }

      return drafting && uploading;
    });
    return [drafting, uploading];
  }, [state.items]);
  const handleSubmitChanges = useCallback(async () => {
    if (isUploading || updateProjectTrigger.loading) {
      return;
    }

    const documents = state.items
      .filter(item => item.document && !item.removed)
      .map(item => item.document!);
    await updateProjectTrigger.trigger({
      documents
    });
    onUpdateProject({
      slug: project.slug,
      documents
    });
  }, [state, project, isDrafting, isUploading]);
  const removeItem = useCallback(
    (id: string | number) => {
      setState(prevState => ({
        items: prevState.items.map(item => {
          if (item.id === id) {
            return {
              ...item,
              removed: true
            };
          }

          return item;
        })
      }));
    },
    [setState]
  );

  return (
    <div
      id="documentos"
      className={`radius-10 bg-white shadow mb-4${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="p-4 relative">
        {isDrafting && (
          <div className="float-right">
            <button
              type="button"
              onClick={onCancelEdition}
              className="btn btn-muted mr-2"
            >
              <Icon name="close" className="mr-2" />
              {intl.formatMessage(CANCELAR)}
            </button>
            <button
              type="button"
              className="btn btn-primary mr-2"
              onClick={handleSubmitChanges}
              disabled={isUploading || updateProjectTrigger.loading}
            >
              <Icon name="save" className="mr-2" />
              {intl.formatMessage(SALVAR)}
              {updateProjectTrigger.loading && (
                <ActivityIndicator size={24} fill="#fff" className="ml-2" />
              )}
            </button>
          </div>
        )}
        <h4 className="tw-normal mb-0">{intl.formatMessage(DOCUMENTOS)}</h4>
      </div>
      {!hasDocuments && (
        <div className="px-3 pb-5 ta-center">
          <PlaceholderIcon name="file_copy" />
          <span className="h4 block tw-normal mb-2">
            {intl.formatMessage(DOCUMENTOS_DA_VAGA)}
          </span>
          <span className="tc-muted block mb-3">
            {intl.formatMessage(DOCUMENTOS_HINT)}
          </span>
          <div className="btn btn-outline-primary inputFileWrapper">
            <input type="file" onChange={handleInputFileChange} multiple />
            <Icon name="add" /> {intl.formatMessage(ADICIONAR)}
          </div>
        </div>
      )}
      {hasDocuments && (
        <>
          <div className="px-3 py-1 card-item">
            <span className="ts-small tw-medium">
              {intl.formatMessage(ARQUIVO)}
            </span>
          </div>
          {state.items.map(item => (
            <Item className="relative card-item" key={item.id}>
              {!item.removed && (
                <ButtonRemove
                  type="button"
                  className="btn btn-error"
                  onClick={() => removeItem(item.id)}
                >
                  <Icon name="close" />
                </ButtonRemove>
              )}
              <div className="text-truncate p-3 media">
                <Icon
                  name={item.removed ? "delete_outline" : "insert_drive_file"}
                  className="mr-2"
                />
                <div className="media-body">
                  {item.document ? (
                    <a
                      className={item.removed ? "tc-muted td-line-through" : ""}
                      href={item.document.document_url}
                      target="__blank"
                    >
                      {item.document.document_url}
                    </a>
                  ) : (
                    <span className="tc-muted">
                      {intl.formatMessage(CARREGANDO)}
                    </span>
                  )}
                  {item.isDraft && (
                    <>
                      <br />
                      <span className="badge bg-error">
                        {intl.formatMessage(NOVO)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Item>
          ))}
        </>
      )}
      {hasDocuments && (
        <div className="card-item p-4">
          <div className="btn btn-outline-primary inputFileWrapper">
            <input type="file" onChange={handleInputFileChange} multiple />
            <Icon name="add" /> {intl.formatMessage(ADICIONAR_DOCUMENTOS)}
          </div>
        </div>
      )}
    </div>
  );
};

ProjectManagePageDocuments.displayName = "ProjectManagePageDocuments";

export default React.memo(
  connect(
    (state: RootState) => ({ viewer: state.user! }),
    { onUpdateProject: updateProject }
  )(ProjectManagePageDocuments)
);

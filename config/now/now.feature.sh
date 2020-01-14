#!/bin/bash
set -e

CLEAN_BRANCH_NAME=${CIRCLE_BRANCH//\//-};

JSON=$(cat <<-EOF
{
    "name": "$CIRCLE_PROJECT_REPONAME-$CLEAN_BRANCH_NAME",
    "version": 2,
    "regions": ["gru1"],
    "alias": [
        "$CLEAN_BRANCH_NAME-branch.atados.now.sh"
    ],
    "env": {
      "AUTH_FACEBOOK_ID": "404698100005908",
      "AUTH_FACEBOOK_SECRET": "96a568db47065ccccfad776400d59621",
      "AUTH_GOOGLE_ID": "918461596783-jv79oq54dqqlj7lqm3s2p6osdvt7fb6q.apps.googleusercontent.com",
      "AUTH_GOOGLE_SECRET": "KcQWEju_TybqcL3gbaeNm4BW",
      "AUTH_CLIENT_ID": "x4FR4jyyuVXvuHMiZiflT7y9l2o15MYJjiHqLUmP",
      "AUTH_CLIENT_SECRET": "JhK5yjm0XLQx7rH1dygobly3cSx5cIEGJYaGQTRhhEYzx6T4wZ2RqYn1sLKoMiXN5233CgmDeLurgl6YHPrBP2wDdg2VteOyOrlXhHWjU5nvGWw3YQi8zqTgyvK3BZ3b"
    },
    "build": {
      "env": {
        "API_URL": "https://api.beta.atados.com.br",
        "APP_URL": "https://staging.atados.now.sh",
        "APP_SHARE_URL": "http://staging.atados.now.sh",
        "AUTH_CLIENT_ID": "x4FR4jyyuVXvuHMiZiflT7y9l2o15MYJjiHqLUmP",
        "AUTH_CLIENT_SECRET": "JhK5yjm0XLQx7rH1dygobly3cSx5cIEGJYaGQTRhhEYzx6T4wZ2RqYn1sLKoMiXN5233CgmDeLurgl6YHPrBP2wDdg2VteOyOrlXhHWjU5nvGWw3YQi8zqTgyvK3BZ3b"
      }
    }
}
EOF
)

echo $JSON > now.feature.json

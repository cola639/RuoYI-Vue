pipeline{
    agent any
    environment {
      // 镜像名称
      IMAGE_NAME = "ruoyi-ui"
      // 工作目录
      WS = "${WORKSPACE}"
      // 自定义的构建参数
      PROFILE = "prod"
    }

    // 定义流水线的加工流程
    stages {
       stage('1.Enviroment'){
            steps {
               sh 'pwd && ls -alh'
               sh 'printenv'
               sh 'docker version'
               sh 'git --version'
            }
        }

        stage('2.Compile'){
            agent {
                docker {
                    image 'node:14-alpine'
                 }
            }
            steps {
               sh 'pwd && ls -alh'
               sh 'node -v'
               sh 'cd ${WS} && npm install --registry=https://registry.npmmirror.com --no-fund && npm run build:${PROFILE}'
            }
        }

        stage('3.Build'){
            steps {
               sh 'pwd && ls -alh'
               sh 'cp /ssl/ruoyi-cert.pem ${WS}' // 拷贝证书到工作目录
               sh 'cp /ssl/ruoyi-key.pem ${WS}' // 拷贝密钥到工作目录
               sh 'docker build -t ${IMAGE_NAME} .'
            }
        }

        stage('4.Deploy'){
            steps {
                 sh 'pwd && ls -alh'
                 sh 'docker rm -f ${IMAGE_NAME} || true && docker rmi $(docker images -q -f dangling=true) || true'
                 //  向外暴露端口再由内部Nginx代理到静态文件
                 sh 'docker run -d -p 8889:80 -p 443:443 --name ${IMAGE_NAME} --link ruoyi-admin:ruoyi-admin ${IMAGE_NAME}'
            }
        }

    }
}
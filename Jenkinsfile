/* groovylint-disable CompileStatic, DuplicateStringLiteral, GStringExpressionWithinString, LineLength */
// Jenkinsfile先于Docker 并执行Dockerfile配置
pipeline {
    agent any
    environment {
        // 前后端互通网络组
        NETWORK = 'ruoyi'
        // 镜像名称
        IMAGE_NAME = 'ruoyi-vue'
        // 工作目录
        WS = "${WORKSPACE}"
        // 自定义的构建参数
        PROFILE = 'prod'
        // 放在宿主机nginx
        NGINX = 'ruoyi'
    }

    // 定义流水线的加工流程
    stages {
        stage('1.Enviroment') {
            steps {
                sh 'pwd && ls -alh'
                sh 'printenv'
                sh 'docker version'
                sh 'git --version'
            }
        }

        stage('2.Compile') {
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

        stage('3.Build') {
            steps {
                sh 'pwd && ls -alh'
                sh 'docker build -t ${IMAGE_NAME} .'
            }
        }

        stage('4.Deploy') {
            steps {
                sh 'pwd && ls -alh'
                sh 'docker rm -f ${IMAGE_NAME} || true && docker rmi $(docker images -q -f dangling=true) || true'
                sh 'docker run -d --net ${NETWORK} -p 8888:80 --name ${IMAGE_NAME} ${IMAGE_NAME}'
                // sh """
                //     docker run -d --net ${NETWORK} -p 8888:81 -p 443:443 \\
                //       --name ${IMAGE_NAME} \\
                //       -v /www/nginx/ruoyi.conf:/etc/nginx/nginx.conf \\
                //       ${IMAGE_NAME}
                //    """
            }
        }
    }
}

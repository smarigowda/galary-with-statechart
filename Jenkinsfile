pipeline {
  agent any
  stages {
    stage('Stage One') {
      steps {
        echo 'Hello world! Gallary App with State Chart'
        checkout scm
	    sh"""#!/bin/bash -l
           nvm use v8.10.0
           npm install
           npm run build
           CI=true npm test -- --coverage --verbose
        """
      }
    }
  }
}
FROM node:18.14

# Login to container as root user
USER root

# Symfony dev environement 
ENV NODE_ENV=development

# Set working directory
WORKDIR /app 

# COPY ./sae4app /app/

# Arguments defined in compose.yml
ARG USER_NAME
ARG USER_ID
ARG GROUP_NAME
ARG GROUP_ID

# Create system user to run npm commands
RUN if [ ! -z ${USER_NAME} ] && [ ! -z ${GROUP_NAME} ] && [ ${USER_ID:-0} -ne 0 ] && [ ${GROUP_ID:-0} -ne 0 ] ; then \
    # useradd -G www-data,root -u $USER_ID -d /home/$USER_NAME $USER_NAME && \
    # mkdir -p /home/$USER_NAME/.composer  && \
    chown -Rf ${USER_NAME}:${GROUP_NAME} /home/$USER_NAME  && \
    chown -R ${USER_NAME}:${GROUP_NAME} /app \
    ; fi

# Login to container as non-root user 
USER ${USER_ID:-0}:${GROUP_ID:-0}

# RUN npm install
# CMD [ "npm", "run", "start" ]
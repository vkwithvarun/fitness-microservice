FROM quay.io/keycloak/keycloak:25.0
ENV KC_HOSTNAME_STRICT=false
ENV KC_HOSTNAME_STRICT_HTTPS=false
ENV KC_HTTP_ENABLED=true
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start-dev"]

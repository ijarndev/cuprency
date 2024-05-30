# Cuprency
Cuprency es un servicio creado para obtener información real sobre los valores de cambio de las monedas extranjeras en Cuba

### Estructura del proyecto

- **Vista en tiempo real** ```/src/realtime```: Información en tiempo real sobre los valores de cambio de las monedas construído a partir de una red de sockets que incluye a los usuarios y a un conjunto de **crawlers**.
- **API pública**: ```/src/api``` La API de Cuprency está diseñada para brindar información más detallada sobre los valores de cambio. Es un servicio pensado para la escalabilidad y adición progresiva de funcionalidades.
- **Cuprency WebView** ```external-service```: WebView es una aplicación externa de Cuprency, diseñada para conectarse el servicio de información en tiempo real y brindar la información de forma simple, accesible y gratuita.

## Detalles técnicos

#### Conceptos de Cuprency:
  - **Crawler**: Pieza de software encargada de recopilar información que nutre a la base de datos de Cuprency.
  - **Cliente**: Instancia desde la que se consume cualquier servicio brindado por Cuprency.

#### Comandos de la CLI:
  - ```pnpm run dev```: Inicia un servidor web que sirve la API de Cuprency.
  - ```pnpm run bot```: Inicia el primer **DataCrawler** del sistema, un bot de Telegram.
  - ```pnpm run realtime```: Inicia el servidor en tiempo real que sirve información mediante sockets.

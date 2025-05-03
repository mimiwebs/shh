# demoGossipy
 
## Project Setup 
## Localde çalıştırmak için iki farklı klasörü de terminalde başlatılması gerekiyor.
Client ve server diye iki dosya var. PC'ye node.js kurulmalı. 
Sonrasında bir terminal içinde server klasörüne gidilip, kütüphaneleri kurmak için npm install komutu, ve server'i başlatmak icin `` npm start `` komutu girilecek.
Sonra farklı bir terminal icinde client klasörüne gidilecek, kütüphaneleri kurmak icin npm install ve projeyi başlatmak için `` npm run dev`` komutu girilecek.

## şayet proje relase edilmediyse
client/src/http/config/api-url.js dosya yolundaki apiUrl'in adresini terminalde başlattığı server'in url'i ile değiştirecek.
Projeyi release yapmadan öncesinde apiUrl tekrardan "/" olmalı.

## Deployment / Release aşamasında ise, 
client klasörünün terminalinde ``npm run build --modern`` komutunu girecek.
remote server'a ise sadece server klasörünü yükleyecek.

## Author

- coded by [@denizaslantatar]
- coded by [@apsisxcoder]

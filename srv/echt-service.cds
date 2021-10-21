using { quadrio.cap.bestpractices as my } from '../db/schema';
service EchtService {
  entity Books as projection on my.Books;
  entity Echt1 as projection on my.Echt1;
  entity Echt2 as projection on my.Echt2;
}

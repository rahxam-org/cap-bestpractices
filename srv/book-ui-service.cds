using { quadrio.cap.bestpractices as my } from '../db/schema';
service BookUiService @(requires : 'user') {
  entity Books as projection on my.Books;
}

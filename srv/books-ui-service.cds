using { quadrio.cap.bestpractices as my } from '../db/schema';
using { API_AUTHORS } from './external/API_AUTHORS';
service BooksUiService @(requires : 'user') {
  entity Books as projection on my.Books;
  entity Authors as projection on API_AUTHORS.Authors;
}

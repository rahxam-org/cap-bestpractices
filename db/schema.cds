using { cuid } from '@sap/cds/common';
namespace quadrio.cap.bestpractices;

entity Books : cuid {
  name : String;
}

entity Echt1 : cuid {
  name : String;
}

entity Echt2 : cuid {
  name : String;
  echt1 : Association to one Echt1;
}

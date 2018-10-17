/**
 * Interfaces für die json Objekte in FireBasedB
 */


export class ComponentObjectDB {
  id: string;
  aks: string;
  name: string;
  group: string;
  author: string;
  date: string;
  informationID: string;
  livevalueID: string[];
  documentsID: string[];
}

export class InformationObjectDB {
  id: string;
  productname: string;
  manufacturer?: string;
  manufacturerurl?: string;
  producttype?: string;
  supplier?: string;
  supplierurl?: string;
  ordernumber?: string;
  description?: string;
}

export class LivevalueObjectDB {
  id: string;
  aks: string;
  numericId: string;
  name: string;
  timestamp: string;
  value: number;
  unit?: string;
}

export class DocumentObjectDB {
  id: string;
  name: string;
  url: string;
}

export class UserObjectDB {
  name: string;
  level: string;
}

/**
 * Interface für Komponentenobjekt zu UI
 *
 */

export interface InterfaceComponentObject {
  id: string;
  aks: string;
  name: string;
  group: string;
  author: string;
  date: string;
  information: InterfaceInformationObject;
  livevalue: InterfaceLivevalueObject[];
  documents: InterfaceDocumentObject[];
}



export interface InterfaceInformationObject {
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

export interface InterfaceLivevalueObject {
  id: string;
  aks: string;
  numericId: string;
  name: string;
  timestamp: string;
  value: number;
  unit: string;
}

export interface InterfaceDocumentObject {
  id: string;
  name: string;
  url: string;
}



export interface CooperativeProperties {
  [key: string]: any;
}

export interface CooperativeFeature {
  type: "Feature";
  properties: CooperativeProperties;
  geometry: {
    type: "Point" | "Polygon" | "MultiPolygon";
    coordinates: any;
  };
}

export interface CooperativeGeoJSON {
  type: "FeatureCollection";
  features: CooperativeFeature[];
}

export interface AppState {
  data: CooperativeGeoJSON | null;
  loading: boolean;
  error: string | null;
  selectedCoop: CooperativeFeature | null;
  searchTerm: string;
}

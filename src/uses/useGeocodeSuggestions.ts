import { useEffect, useMemo, useState } from "react";
import { useTrackedState } from "../store";

export const useGeocodeSuggestions = (index: number) => {
  const state = useTrackedState();

  const [suggestions, setSuggestions] = useState<{
    address: string;
    location: { lat: number; lng: number };
  }[]>([]);

  useMemo(() => {
    setSuggestions(state.inputs[index].geocoderSuggestions ? 
      state.inputs[index].geocoderSuggestions!.map(
        (suggestion) => 
        (
          {
            address: suggestion.place_name,
            location: { lat: suggestion.center[1], lng: suggestion.center[0] }
          }
        )) : []);
  }, [state.inputs[index].geocoderSuggestions]);

  return suggestions;
}

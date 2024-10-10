"use client";

import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Pin } from "@/lib/types";
import { useSelectedPin } from "@/components/SplitView";
import { cn } from "@/lib/utils";

export default function GoogleMap({
  pins,
  className,
}: {
  pins: Pin[];
  className: string;
}) {
  const { selectedPin, setSelectedPin } = useSelectedPin();

  const mapRef = React.useRef<HTMLDivElement>(null);
  const InfoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "quarterly",
      });

      const { Map } = await loader.importLibrary("maps");

      let centerLocation = {
        lat: 37.868529,
        lng: -122.256771,
      };

      // Get the user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          centerLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        });
      }

      const { AdvancedMarkerElement } = (await loader.importLibrary(
        "marker",
      )) as google.maps.MarkerLibrary;

      const options: google.maps.MapOptions = {
        center: centerLocation,
        zoom: 15,
        mapId: "NEXT_MAPS_TUTS",
        disableDefaultUI: true,
        backgroundColor: "var(--bg-color)",
      };

      const map = new Map(mapRef.current as HTMLDivElement, options);

      map.setCenter(centerLocation);

      // Get the user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const userMarkerElement = document.createElement("div");
          userMarkerElement.innerHTML = `
						<div class="relative group">
							<div class="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-full opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300"></div>
							<div class="relative w-6 h-6 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110">
								<div class="absolute inset-0.5 bg-gradient-to-br from-white to-transparent opacity-30 rounded-full"></div>
							</div>
						</div>
					`;

          new AdvancedMarkerElement({
            map,
            position: userLocation,
            content: userMarkerElement,
          });
        });
      }

      // Create markers and store them in markersRef
      pins.forEach((pin) => {
        const markerElement = document.createElement("div");
        markerElement.innerHTML = `
          <div class="relative group">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110">
              <div class="absolute inset-0.5 bg-gradient-to-br from-white to-transparent opacity-30 rounded-full"></div>
            </div>
          </div>
        `;

        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: pin.lat, lng: pin.lng },
          content: markerElement,
        });

        // Store marker with a unique identifier (e.g., message)
        markersRef.current.set(pin.message, marker as never);

        marker.addListener("click", () => {
          setSelectedPin(pin);
        });
      });
    };

    initializeMap();
  }, [pins, setSelectedPin]);

  useEffect(() => {
    if (!mapRef.current) return;

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
      version: "quarterly",
    });

    loader.load().then(() => {
      // Assuming the map has been initialized
      // Close the previous InfoWindow
      if (InfoWindowRef.current) {
        InfoWindowRef.current.close();
      }

      if (selectedPin) {
        const marker = markersRef.current.get(selectedPin.message);
        if (marker) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const map = (marker as any).map; // Access the map from the marker
          const infoWindow = new google.maps.InfoWindow({
            content: `<div class="dark:text-black">${selectedPin.message}</div>`,
            pixelOffset: new google.maps.Size(0, -30),
          });

          infoWindow.open(map, marker);
          InfoWindowRef.current = infoWindow;

          // Optionally, center the map on the selected marker
          map.panTo({ lat: selectedPin.lat, lng: selectedPin.lng });
        }
      }
    });
  }, [selectedPin]);

  return <div className={cn("h-screen w-screen", className)} ref={mapRef} />;
}

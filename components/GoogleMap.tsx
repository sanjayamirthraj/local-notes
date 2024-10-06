"use client";

import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Pin } from "@/lib/types";

export default function GoogleMap({ pins }: { pins: Pin[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const currentInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "quarterly",
      });

      const { Map } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = (await loader.importLibrary(
        "marker",
      )) as google.maps.MarkerLibrary;

      let centerLocation = {
        lat: 137.8685573,
        lng: 122.256697,
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

      const createMarkerElement = (isUser: boolean) => {
        const markerElement = document.createElement("div");
        markerElement.className = "relative group";

        const gradientDiv = document.createElement("div");
        gradientDiv.className = `absolute inset-0 bg-gradient-to-br ${
          isUser ? "from-red-400 to-red-600" : "from-purple-400 to-blue-500"
        } rounded-full opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300`;

        const innerDiv = document.createElement("div");
        innerDiv.className = `relative w-6 h-6 bg-gradient-to-br ${
          isUser ? "from-red-500 to-red-700" : "from-purple-500 to-blue-600"
        } rounded-full shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110`;

        const shineDiv = document.createElement("div");
        shineDiv.className =
          "absolute inset-0.5 bg-gradient-to-br from-white to-transparent opacity-30 rounded-full";

        innerDiv.appendChild(shineDiv);
        markerElement.appendChild(gradientDiv);
        markerElement.appendChild(innerDiv);

        return markerElement;
      };

      const options: google.maps.MapOptions = {
        center: centerLocation,
        zoom: 15,
        mapId: "NEXT_MAPS_TUTS",
      };

      const map = new Map(mapRef.current as HTMLDivElement, options);

      // Create user marker
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const userMarker = new AdvancedMarkerElement({
            map,
            position: userLocation,
            content: createMarkerElement(true),
          });
          console.log("User Marker Position:", userMarker.position);
        });
      }

      // Create markers for memories
      pins.forEach((pin) => {
        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: pin.lat, lng: pin.lng },
          content: createMarkerElement(false),
        });

        marker.addListener("click", () => {
          if (currentInfoWindowRef.current) {
            currentInfoWindowRef.current.close();
          }

          currentInfoWindowRef.current = new google.maps.InfoWindow({
            content: pin.message,
          });
          currentInfoWindowRef.current.open(map, marker);
        });
      });
    };

    initializeMap();
  }, [pins]);

  return <div className="h-screen w-screen" ref={mapRef} />;
}

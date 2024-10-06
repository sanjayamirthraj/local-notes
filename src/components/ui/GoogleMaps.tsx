"use client";

import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Define the Memory type
type Memory = {
  lat: number;
  lng: number;
  message: string;
};

// Sample memories (you can replace these with your actual data)
const getRandomCoordinate = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export default function GoogleMaps() {
  // defining the memories state
    const [memories, setMemories] = useState([
      { lat: 37.8685573, lng: -122.256697, message: "First memory" },
      { lat: 37.8695573, lng: -122.257697, message: "Second memory" },
      { lat: 37.8675573, lng: -122.255697, message: "Third memory" },
      {
        lat: getRandomCoordinate(37.86, 37.87),
        lng: getRandomCoordinate(-122.26, -122.25),
        message: "Fourth memory",
      },
    ]);

  const mapRef = React.useRef<HTMLDivElement>(null);
  let currentInfoWindow: google.maps.InfoWindow | null = null;

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "quarterly",
      });

      const { Map } = await loader.importLibrary("maps");

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

      const { AdvancedMarkerElement } = (await loader.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      const options: google.maps.MapOptions = {
        center: centerLocation,
        zoom: 15,
        mapId: "NEXT_MAPS_TUTS",
      };

      const map = new Map(mapRef.current as HTMLDivElement, options);

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

          const userMarker = new AdvancedMarkerElement({
            map,
            position: userLocation,
            content: userMarkerElement,
          });
        });
      }

      // Create markers and info windows for each memory
      memories.forEach((memory: any, index: any) => {
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
          position: { lat: memory.lat, lng: memory.lng },
          content: markerElement,
        });

        marker.addListener("click", () => {
          // Close the currently opened info window if it exists
          if (currentInfoWindow) {
            currentInfoWindow.close();
          }

          // Create a new info window and open it
          currentInfoWindow = new google.maps.InfoWindow({
            content: memory.message,
          });
          currentInfoWindow.open(map, marker);
        });
      });
    };

    initializeMap();
  }, []);

  return <div className="h-screen w-screen" ref={mapRef} />;
}

/*
  MapPicker Component – Google Maps + RTL Arabic Labels
  ---------------------------------------------
  ◽ يحفظ lat, lng, formatted_address
  ◽ يدعم البحث بعنوان أو إسقاط دبوس
  ◽ يرسل النتيجة إلى parent via onSelect

  ✅ التركيب:
    <MapPicker onSelect={(lat,lng,address)=>setValue('location',{lat,lng,address})} />

  ▸ يعتمد على @react-google-maps/api (موجود في package.json)
  ▸ يحتاج GOOGLE_MAPS_API_KEY في env
*/

'use client';
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { useCallback, useRef, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '0.75rem'
};

interface Props {
  defaultCenter?: google.maps.LatLngLiteral;
  onSelect: (lat: number, lng: number, address: string) => void;
}

export default function MapPicker({ defaultCenter = { lat: 24.774265, lng: 46.738586 }, onSelect }: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
    language: 'ar',
  });

  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral | null>(null);
  const autoRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoadAuto = (auto: google.maps.places.Autocomplete) => (autoRef.current = auto);

  const onPlaceChanged = () => {
    if (!autoRef.current) return;
    const place = autoRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) return;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const addr = place.formatted_address || '';
    setMarkerPos({ lat, lng });
    onSelect(lat, lng, addr);
  };

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPos({ lat, lng });
    // Reverse geocode (basic – only lat,lng if fails)
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (res) => {
      const addr = res?.[0]?.formatted_address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      onSelect(lat, lng, addr);
    });
  }, [onSelect]);

  if (!isLoaded) return <p className="text-center py-8">جاري تحميل الخريطة…</p>;

  return (
    <div className="space-y-2 rtl:text-right">
      <Autocomplete onLoad={onLoadAuto} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="ابحث عن عنوان أو أسقط دبوسًا على الخريطة"
          className="w-full rounded-lg border p-2 text-sm focus:outline-none"
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPos || defaultCenter}
        zoom={markerPos ? 15 : 10}
        onClick={handleMapClick}
        options={{ streetViewControl: false, mapTypeControl: false }}
      >
        {markerPos && <Marker position={markerPos} />}
      </GoogleMap>
    </div>
  );
}

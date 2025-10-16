import { LngLat, type MapLayerMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  RLayer,
  RMap,
  RPopup,
  RSource,
  useMap,
} from 'maplibre-react-components';
import { getHoydeFromPunkt } from '../api/getHoydeFromPunkt';
import { useEffect, useState } from 'react';
import { Overlay } from './Overlay';
import DrawComponent from './DrawComponent';
import { SearchBar, type Address } from './SearchBar';
import { getBygningAtPunkt } from '../api/getBygningAtPunkt';
import type { GeoJSON } from 'geojson';

const UIO_COORDS: [number, number] = [10.71788676054797, 59.94334031458817];

export const MapLibreMap = () => {
  const [pointHoyde, setPointHoydeAtPunkt] = useState<number | undefined>(
    undefined
  );
  const [clickPoint, setClickPoint] = useState<LngLat | undefined>(undefined);
  const [hoyde, setHoydeAtPunkt] = useState<undefined | number>(undefined);
  const [address, setAddress] = useState<Address | null>(null);
  const [bygningsOmriss, setBygningsOmriss] = useState<GeoJSON | undefined>(
    undefined
  );

  useEffect(() => {
    console.log(pointHoyde, clickPoint);
  }, [clickPoint, pointHoyde]);

  const polygonStyle = {
    'fill-outline-color': 'rgba(0,0,0,0.1)',
    'fill-color': 'rgba(18, 94, 45, 0.41)',
  };

  const onMapClick = async (e: MapLayerMouseEvent) => {
    setAddress(null); // Clear address when clicking on map

    const bygningResponse = await getBygningAtPunkt(e.lngLat.lng, e.lngLat.lat);

    if (bygningResponse?.Bygninger?.[0]?.FkbData?.BygningsOmriss) {
      const geoJsonObject = JSON.parse(
        bygningResponse.Bygninger[0].FkbData.BygningsOmriss
      );
      setBygningsOmriss(geoJsonObject);
    } else {
      setBygningsOmriss(undefined);
    }

    const hoyder = await getHoydeFromPunkt(e.lngLat.lng, e.lngLat.lat);
    setPointHoydeAtPunkt(hoyder[0].Z);
    setClickPoint(new LngLat(e.lngLat.lng, e.lngLat.lat));
  };

  return (
    <RMap
      minZoom={6}
      initialCenter={UIO_COORDS}
      initialZoom={15}
      mapStyle="https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json"
      style={{
        height: `calc(100dvh - var(--header-height))`,
      }}
      onClick={onMapClick}
    >
      <Overlay>
        <SearchBar setAddress={setAddress} />
      </Overlay>
      {bygningsOmriss && (
        <>
          <RSource id="bygning" type="geojson" data={bygningsOmriss} />
          <RLayer
            source="bygning"
            id="bygning-fill"
            type="fill"
            paint={polygonStyle}
          />
        </>
      )}
      {address && (
        <MapFlyTo
          lngLat={
            new LngLat(address.PayLoad.Posisjon.X, address.PayLoad.Posisjon.Y)
          }
        />
      )}
      <DrawComponent />
      {clickPoint && pointHoyde !== undefined && (
        <RPopup longitude={clickPoint.lng} latitude={clickPoint.lat}>
          <div style={{ padding: '8px' }}>
            <strong>Høyde:</strong> {pointHoyde.toFixed(2)} m
          </div>
        </RPopup>
      )}
    </RMap>
  );
};

function MapFlyTo({ lngLat }: { lngLat: LngLat }) {
  const map = useMap();

  useEffect(() => {
    console.log('Flying to:', lngLat.lng, lngLat.lat);
    map.flyTo({ center: [lngLat.lng, lngLat.lat], zoom: 17, speed: 3 });
  }, [lngLat, map]);

  return null;
}

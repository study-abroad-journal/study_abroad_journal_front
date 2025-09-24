"use client";

import React,{useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Calendar } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DiaryEntry } from '@/types';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface DiaryMapProps {
  entries: DiaryEntry[];
}

export default function DiaryMap({ entries }: DiaryMapProps) {

  const initialPosition: L.LatLngTuple = [35.6809591, 139.7673068];
  const initialZoom = 12;

  useEffect(() => {
    // entriesの中からIDとlocationだけを抜き出した新しい配列を作成
    const locations = entries.map(entry => ({
      id: entry.id,
      title: entry.title,
      location: entry.location
    }));

    // 作成した配列をコンソールに出力
    console.log("📍 DiaryMapに渡された位置情報一覧:", locations);

    // 見やすいテーブル形式で表示したい場合はこちらを使います
    // console.table(locations);

  }, [entries]); // entriesが変更されるたびにこの処理が実行される

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-400 to-blue-500 p-4 text-white">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <h2 className="text-lg font-medium">Diary Locations</h2>
        </div>
        <p className="text-emerald-100 text-sm mt-1">
          {entries.length} entries recorded
        </p>
      </div>
      
      <div className="h-64 bg-gray-100 relative flex items-center justify-center">       
        <MapContainer center={initialPosition} zoom={initialZoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {entries
            .filter(entry => entry.location)
            .map(entry => (
              <Marker
                key={entry.id}
                position={[entry.location!.latitude, entry.location!.longitude]}
              >
                <Popup>
                  <b>{entry.title}</b>
                </Popup>
              </Marker>
            ))
          }
        </MapContainer>

        {entries.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10 pointer-events-none">
            <div className="text-center text-gray-600">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm font-semibold">地図に表示する日記がありません</p>
              <p className="text-xs text-gray-500">位置情報付きの日記を投稿してください</p>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
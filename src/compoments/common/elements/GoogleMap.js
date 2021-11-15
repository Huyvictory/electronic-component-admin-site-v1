import React, { useEffect, useState, useRef } from 'react';

import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { API_KEY_MAP, InitialPosition } from '../../../constants';
import { Spin } from "antd";
// const google = window.google;
const mapStyles = {
    width: '100%',
    height: '100%'
  };

const GoogleMap = (props) => {
    const refMap = useRef();
    const [ state, setState ] = useState({
        pointsList: {},
    });
    useEffect(() => {
        const { points, isSearched, mapLocation } = props;
        const tmp = {};
        points && points.forEach(point => {
            if(tmp[point.agencyId]){
                tmp[point.agencyId].push({...point});
            }
            else{
                tmp[point.agencyId] = [];
                tmp[point.agencyId].push({...point});
            }
        })

        if(!mapLocation){
            if(points.length >= 1){
                refMap.current && refMap.current.map.setCenter({
                    lat: points[0].latitude,
                    lng: points[0].longitude,
                })
            }
            else if(!isSearched){
                refMap.current && refMap.current.map.setCenter({
                    ...InitialPosition
                })
            }
        }
        else{
            refMap.current && refMap.current.map.setCenter({
                lat: mapLocation.value&&mapLocation.value.lat? mapLocation.value.lat:InitialPosition.lat,
                lng: mapLocation.value&&mapLocation.value.lng? mapLocation.value.lng:InitialPosition.lng,
            })
        }

        setState({
            pointsList: tmp,
        });
    }, [JSON.stringify(props.points), JSON.stringify(props.mapLocation)]);



    const onMarkerClick = (markerProps, marker, e) => {
        props.handleMarkerClick && props.handleMarkerClick(markerProps);
    }
    const renderMarker = () => {
        const { mapLocation } = props;
        const markers = Object.keys(state.pointsList) && Object.keys(state.pointsList).map(agencyId=>(
            <Marker
                key={agencyId}
                position={{
                    lat: state.pointsList[agencyId][0].latitude,
                    lng: state.pointsList[agencyId][0].longitude,
                }}
                icon={{
                    path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0",
                    fillColor: "red",
                    fillOpacity: 1,
                    strokeColor: '#000',
                    strokeWeight: 1,
                }}
                onClick={onMarkerClick}
                name={state.pointsList[agencyId][0].agencyName}
                pointData={state.pointsList[agencyId]}
                />
            ))
        if(mapLocation && mapLocation.value){
            markers.push((
                <Marker
                key="0"
                position={{
                    lat: mapLocation.value.lat,
                    lng: mapLocation.value.lng,
                }}
                icon={{
                    path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0",
                    fillColor: "green",
                    fillOpacity: 1,
                    strokeColor: '#000',
                    strokeWeight: 1,
                }}
                />
            ))
        }    
        return markers; 
    }
    return (
        <Spin tip="Loading..." spinning={props.loading}>
            <div style={{position: "relative",  minHeight: "calc(99vh - 258px)", marginTop: "1vh"}}>
                <Map
                ref={refMap}
                google={props.google}
                zoom={14}
                style={mapStyles}
                initialCenter = {{...InitialPosition}}
                >
                    {renderMarker()}
                </Map>
            </div>
        </Spin>
    );
}

export default GoogleApiWrapper({
    apiKey: API_KEY_MAP
  })(GoogleMap);
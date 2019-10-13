import React from "react";
import ReactDOM from "react-dom";
import FindAddressPresenter from "./FindAddressPresenter";
import { reverseGeoCode, geoCode } from "../../mapHelpers";

interface IState {
    lat: number;
    lng: number;
    address: string;
}

class FindAddressContainer extends React.Component<any, IState> {
    public mapRef: any;
    public map: google.maps.Map;
    public state = {
        address: "",
        lat: 0,
        lng: 0
    };
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
    }
    public componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            this.handleGeoSuccess,
            this.handleGeoError
        );
    }
    public render() {
        const { address } = this.state;
        return (
            <FindAddressPresenter
                mapRef={this.mapRef}
                address={address}
                onInputChange={this.onInputChange}
                onInputBlur={this.onInputBlur}
            />
        );
    }
    public handleGeoSuccess = (positon: Position) => {
        const {
            coords: { latitude, longitude }
        } = positon;
        this.setState({
            lat: latitude,
            lng: longitude
        });
        this.loadMap(latitude, longitude);
        this.reverseGeocodeAddress(latitude, longitude);
    };
    public handleGeoError = () => {
        console.log("No location");
    };
    public loadMap = (lat, lng) => {
        const { google } = this.props;
        const maps = google.maps;
        const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
        const mapConfig: google.maps.MapOptions = {
            center: {
                lat,
                lng
            },
            disableDefaultUI: true,
            minZoom: 11,
            zoom: 14
        };
        this.map = new maps.Map(mapNode, mapConfig);
        this.map.addListener("dragend", this.handleDragEnd);
    };
    public handleDragEnd = () => {
        const newCenter = this.map.getCenter();
        const lat = newCenter.lat();
        const lng = newCenter.lng();

        this.setState({
            lat,
            lng
        });
        this.reverseGeocodeAddress(lat, lng);
    };
    public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value }
        } = event;
        this.setState({
            [name]: value
        } as any);
    };
    public onInputBlur = async () => {
        const { address } = this.state;
        const result = await geoCode(address);

        if (result) {
            const { lat, lng, formatted_address: formatedAddress } = result;
            this.setState({
                address: formatedAddress,
                lat,
                lng
            });
            this.map.panTo({ lat, lng });
        }
    };
    public reverseGeocodeAddress = async (lat: number, lng: number) => {
        const reversedAddress = await reverseGeoCode(lat, lng);
        if (reversedAddress !== false) {
            this.setState({
                address: reversedAddress
            });
        }
    };
}

export default FindAddressContainer;
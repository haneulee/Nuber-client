import React from "react";
import { RouteComponentProps } from "react-router-dom";
import AddPlacePresenter from "./AddPlacePresenter";
import { toast } from "react-toastify";
import { GET_PLACES } from "../../sharedQueries";
import { ADD_PLACE } from "./AddPlaceQueries";
import { Mutation } from "react-apollo";
import { addPlace, addPlaceVariables } from "../../types/api";

interface IState {
    address: string;
    name: string;
    lat: number;
    lng: number;
}

interface IProps extends RouteComponentProps<any> { }

class AddPlaceContainer extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        const { location: { state = {} } = {} } = props;
        this.state = {
            address: state.address || "",
            lat: state.lat || 0,
            lng: state.lng || 0,
            name: ""
        };
    }
    public render() {
        const { address, name, lat, lng } = this.state;
        const { history } = this.props;
        return (
            <Mutation
                <addPlace, addPlaceVariables>
                mutation={ADD_PLACE}
                onCompleted={data => {
                    const { AddPlace } = data;
                    if (AddPlace.ok) {
                        toast.success("Place added!");
                        setTimeout(() => {
                            history.push("/places");
                        }, 2000);
                    } else {
                        toast.error(AddPlace.error);
                    }
                }}
                refetchQueries={[{ query: GET_PLACES }]}
                variables={{
                    address,
                    isFav: false,
                    lat,
                    lng,
                    name
                }}
                >
                {(addPlaceFn, { loading }) => (
                    <AddPlacePresenter
                        onInputChange={this.onInputChange}
                        address={address}
                        name={name}
                        loading={loading}
                        onSubmit={addPlaceFn}
                        pickedAddress={lat !== 0 && lng !== 0}
                    />
                )}
            </Mutation>
        );
    }

    public onInputChange: React.ChangeEventHandler<
        HTMLInputElement
        > = async event => {
            const {
                target: { name, value }
            } = event;
            this.setState({
                [name]: value
            } as any);
        };
}

export default AddPlaceContainer;
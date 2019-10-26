import { SubscribeToMoreOptions } from "apollo-client";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import RidePresenter from "./RidePresenter";
import { GET_RIDE, RIDE_SUBSCRIPTION, UPDATE_RIDE_STATUS } from "./RideQueries";
import { Query, Mutation } from "react-apollo";
import {
    getRide,
    getRideVariables,
    updateRide,
    updateRideVariables,
    userProfile
} from "../../types/api";
import { USER_PROFILE } from "../../sharedQueries";

interface IProps extends RouteComponentProps<any> { }
// class RideQuery extends Query<getRide, getRideVariables> { }
// class ProfileQuery extends Query<userProfile> { }
// class RideUpdate extends Mutation<updateRide, updateRideVariables> { }

class RideContainer extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
        if (!props.match.params.rideId) {
            props.history.push("/");
        }
    }

    public render() {
        const {
            match: {
                params: { rideId }
            }
        } = this.props;
        return (
            <Query<userProfile> query={USER_PROFILE}>
                {({ data: userData }) => (
                    <Query<getRide, getRideVariables > query= { GET_RIDE } variables={{ rideId }}>
                        {({ data, loading, subscribeToMore }) => {
                    const subscribeOptions: SubscribeToMoreOptions = {
                        document: RIDE_SUBSCRIPTION,
                        updateQuery: (prev, { subscriptionData }) => {
                            if (!subscriptionData.data) {
                                return prev;
                            }
                            const {
                                data: {
                                    RideStatusSubscription: { status }
                                }
                            } = subscriptionData;
                            if (status === "FINISHED") {
                                window.location.href = "/";
                            }
                        }
                    };
                    subscribeToMore(subscribeOptions);
                    return (
                        <Mutation<updateRide, updateRideVariables >
                        mutation= { UPDATE_RIDE_STATUS }
                        // refetchQueries = { { query: GET_RIDE, variables: {rideId}} }
                        >
                        {
                            updateRideFn => (
                                <RidePresenter
                                    userData={userData}
                                    loading={loading}
                                    data={data}
                                    updateRideFn={updateRideFn}
                                />
                            )
                        }
                                </Mutation>
);
}
}
                    </Query >
                )
    }
            </Query >
        );
    }
}
export default RideContainer;
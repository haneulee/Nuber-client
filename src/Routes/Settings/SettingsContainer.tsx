import React from "react";
import { Mutation, Query } from "react-apollo";
import { USER_PROFILE, GET_PLACES } from "../../sharedQueries";
import { LOG_USER_OUT } from "../../sharedQueries.local";
import { userProfile, getPlaces } from "../../types/api";
import SettingsPresenter from "./SettingsPresenter";

// class MiniProfileQuery extends Query<userProfile> { }

class SettingsContainer extends React.Component {
    public render() {
        return (
            <Mutation mutation={LOG_USER_OUT}>
                {logUserOut => (
                    <Query<userProfile> query={USER_PROFILE}>
                        {({ data: userData, loading: userDataLoading }) => (
                            <Query<getPlaces> query={GET_PLACES}>
                                {({ data: placesData, loading: placesLoading }) => (
                                    <SettingsPresenter
                                        userDataLoading={userDataLoading}
                                        placesLoading={placesLoading}
                                        userData={userData}
                                        placesData={placesData}
                                        logUserOut={logUserOut}
                                    />
                                )}
                            </Query>
                        )}
                    </Query>
                )}
            </Mutation>
        )
    }
}

export default SettingsContainer;
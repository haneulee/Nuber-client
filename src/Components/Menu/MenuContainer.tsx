import React from "react";
import MenuPresenter from "./MenuPresenter";
import { Query } from "react-apollo";
import { USER_PROFILE } from "../../sharedQueries";
import { userProfile } from "../../types/api";

// class ProfileQuery extends Query<userProfile> { }

class MenuContainer extends React.Component {
    public render() {
        return (
            <Query<userProfile> query={USER_PROFILE}>
                {({ data, loading }) => <MenuPresenter data={data} loading={loading} />}
            </Query>
        );
    }
}

export default MenuContainer;
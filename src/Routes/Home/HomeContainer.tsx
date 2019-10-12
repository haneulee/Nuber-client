import React from "react";
import { Query } from "react-apollo";
import { RouteComponentProps } from "react-router";
import HomePresenter from "./HomePresenter";
import { USER_PROFILE } from "../../sharedQueries";
import { userProfile } from "../../types/api";

interface IState {
    isMenuOpen: boolean;
}

interface IProps extends RouteComponentProps<any> { }

// class ProfileQuery extends Query<userProfile> { }

class HomeContainer extends React.Component<IProps, IState> {
    public state = {
        isMenuOpen: false
    };
    public render() {
        const { isMenuOpen } = this.state;
        return (
            <Query<userProfile> query={USER_PROFILE}>
                {({ loading }) => (
                    <HomePresenter
                        loading={loading}
                        isMenuOpen={isMenuOpen}
                        toggleMenu={this.toggleMenu}
                    />
                )}
            </Query>
        );
    }
    public toggleMenu = () => {
        this.setState(state => {
            return {
                isMenuOpen: !state.isMenuOpen
            };
        });
    };
}

export default HomeContainer;
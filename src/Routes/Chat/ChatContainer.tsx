import React from "react";
import { Query, MutationFunction, Mutation } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { USER_PROFILE } from "../../sharedQueries";
import { getChat, getChatVariables, userProfile, sendMessage, sendMessageVariables } from "../../types/api";
import ChatPresenter from "./ChatPresenter";
import { GET_CHAT, SEND_MESSAGE, SUBSCRIBE_TO_MESSAGES } from "./ChatQueries";
import { SubscribeToMoreOptions } from "apollo-boost";

interface IProps extends RouteComponentProps<any> { }
interface IState {
    message: "";
}
// class ProfileQuery extends Query<userProfile> { }
// class ChatQuery extends Query<getChat, getChatVariables> { }

class ChatContainer extends React.Component<IProps, IState> {
    public sendMessageFn: MutationFunction;
    constructor(props: IProps) {
        super(props);
        if (!props.match.params.chatId) {
            props.history.push("/");
        }
        this.state = {
            message: ""
        };
    }
    public render() {
        const {
            match: {
                params: { chatId }
            }
        } = this.props;

        const { message } = this.state;
        return (
            <Query<userProfile>
                query={USER_PROFILE}>
                {({ data: userData }) => (
                    <Query<getChat, getChatVariables >
                    query= { GET_CHAT } variables={{ chatId }}>
                        {({ data, loading, subscribeToMore }) => {
                    const subscribeToMoreOptions: SubscribeToMoreOptions = {
                        document: SUBSCRIBE_TO_MESSAGES,
                        updateQuery: (prev, { subscriptionData }) => {
                            if (!subscriptionData.data) {
                                return prev;
                            }

                            const {
                                data: { MessageSubscription }
                            } = subscriptionData;
                            const {
                                GetChat: {
                                    chat: { messages }
                                }
                            } = prev;
                            const newMessageId = MessageSubscription.id;
                            const latestMessageId = messages[messages.length - 1].id;

                            if (newMessageId === latestMessageId) {
                                return;
                            }

                            const newObject = Object.assign({}, prev, {
                                GetChat: {
                                    ...prev.GetChat,
                                    chat: {
                                        ...prev.GetChat.chat,
                                        messages: [
                                            ...prev.GetChat.chat.messages,
                                            MessageSubscription.MessageSubscription
                                        ]
                                    }
                                }
                            });
                            return newObject;
                        }
                    };
                    subscribeToMore(subscribeToMoreOptions);
                    return (
                        <Mutation<sendMessage, sendMessageVariables > mutation= { SEND_MESSAGE } >
                        {
                            sendMessageFn => {
                                this.sendMessageFn = sendMessageFn;
                                return (
                                    <ChatPresenter
                                        data={data}
                                        loading={loading}
                                        userData={userData}
                                        messageText={message}
                                        onInputChange={this.onInputChange}
                                        onSubmit={this.onSubmit}
                                    />
                                );
                            }
                        }
                        </Mutation>
);
}}
                    </Query>
                )
    }
            </Query>
        );
    }

    public onInputChange: React.ChangeEventHandler < HTMLInputElement > = event => {
    const {
        target: { name, value }
    } = event;
    this.setState({
        [name]: value
    } as any);
};
      public onSubmit = () => {
    const { message } = this.state;
    const {
        match: {
            params: { chatId }
        }
    } = this.props;
    if (message !== "") {
        this.setState({
            message: ""
        });
        this.sendMessageFn({
            variables: {
                chatId,
                text: message
            }
        });
    }
    return;
};
}

export default ChatContainer;
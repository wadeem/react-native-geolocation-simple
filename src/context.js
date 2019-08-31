import React from 'react';

const context = React.createContext();
const AppConsumer = context.Consumer;

class AppProvider extends React.Component {

    state = {}

    render() {return <context.Provider>
        {this.props.children}
    </context.Provider>
    }
}

export {AppProvider,AppConsumer};

import React from "react";
import ErrorHandlerPage from "./ErrorHandlerPage";

class ErrorBoundary extends React.Component {
    state = {hasError: false};
    
    static getDerivedStateFromError(error) {
        return { hasError: true,error: error};
    }
    
    componentDidCatch(error, errorInfo) {
      
        console.error("Error in ErrorBoundary:", error, errorInfo);
    }
    render(){
        if (this.state.hasError) {
            return <ErrorHandlerPage error={this.state.error}/>;
        }
        return this.props.children;
    }

}

export default ErrorBoundary;
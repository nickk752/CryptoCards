import React, { Component, PropTypes } from 'react';

export class CreateAuctionWidget extends Component{
    
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div>
                {this.props.showCreateAuction ? 
                    <form action=''>
                        Starting Price: <br/>
                        <input type="number" step=".001" name="startingPrice"/><br/>
                        Ending Price: <br/>
                        <input type="number" step=".001" name="endingPrice"/><br/>
                        Duration: <br/>
                        <input type="number" step=".001" name="duration"/><br/>
                        <input type="submit" value="Submit"/><br/>
                    </form>    
                    :
                    <br/>
                }
            </div> 
        );
    }
}

export default CreateAuctionWidget;
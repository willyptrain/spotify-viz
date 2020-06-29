import React, {useEffect, useState, shouldComponentUpdate} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { Doughnut, Radar, Polar } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import Grid from '@material-ui/core/Grid';


class Mappings extends React.Component {

    constructor(props) {
        super(props);
        this.username = props.data;
        this.chartReference = React.createRef();
        this.token = cookie.get('access_token');
        this.state = {
            scores: [],
            genreLabels: [],
            dataset: [],
            data: []
        };

    }
    shouldComponentUpdate() {
        if(this.state["data"].length == 0) {
            return true;
        }
        return false;
    }

    async componentDidMount()  {
        axios.get(`http://localhost:5000/graphs/short_term/${this.token}`)
        .then(res => {
            this.setState({
                scores: res.data.scores,
                genreLabels: res.data.labels,
                dataset: {
                  data:res.data.scores,
                  label:"User Data",
                  backgroundColor: res.data.colors
                },

                data: [{
                    labels: res.data.labels,
                    datasets: [{
                          data:res.data.scores,
                          label:"User Data",
                          backgroundColor: res.data.colors
                    }]
                }]
            })
        })
        .catch(err => {
            console.log(err);
        })
    }



    render() {

        if(this.state["data"].length > 0) {
                return (


          <Grid container className="grid-container">
            <Grid item xs={12} sm={6}>
              <div style={{ backgroundColor:'none', border:'1px solid black' }}>
                <Doughnut ref={this.chartReference}
                data={this.state.data[0]} />
              </div>
           </Grid>
           <Grid item xs={12} sm={6}>
              <div style={{ backgroundColor:'white' }}>
                <Polar ref={this.chartReference}
                data={this.state.data[0]} />
              </div>
           </Grid>
      </Grid>
);
       } else {
       return (<div></div>)
       }

    }

}

export default Mappings;
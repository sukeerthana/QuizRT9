import React from 'react';
import ReactDOM from 'react-dom';

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import NotificationComponent from './NotificationComponent.jsx';
// var socket = io();
// injectTapEventPlugin();

import restUrl from '../../restUrl';
var username="spsingh559";
export default class MainComponent extends React.Component{

  state = {
    data: [],
    dataNotFound:{},
    count:0
  };
  handleAccept=(obj,id)=>{
    console.log('id is '+ id);
    console.log("*************"+obj);
    var currentData=this.state.data;
    console.log("Request object is");
    console.log(obj);
    console.log('currentData object is');
    console.log(currentData);
    var indexNumber;
    currentData.forEach(function(data,index){
      if(data._id==id){
          indexNumber=index;
      }
    });
console.log('index is '+ indexNumber);
    currentData[indexNumber].NotificationStatus=obj.NotificationStatus;
    currentData[indexNumber].notificationStatustext=obj.notificationStatustext;
    currentData[indexNumber].notificationResultStatus=obj.notificationResultStatus;
    this.setState({
      data:currentData 
    });
      var sendData={updateOBj:obj,id:id};
      console.log(sendData.updateOBj);
    $.ajax({
     url:restUrl+'/api/v1/notifications/',
     type:"PATCH",
     data:JSON.stringify(sendData),
     contentType: 'application/json',
     success:function (data) {
     }.bind(this),
     error:function(){
       console.log("error in submitting status");
     }.bind(this)
    });
  };

  getNotification=()=>{
    // var targetId=2000; 
    console.log("executed");
    $.ajax({
      url:restUrl+'/api/v1/notifications/'+username,
      type:'GET',
      success: function(data){
         console.log('notifications success');

         console.log(data.msg);
        this.setState({
      data:data.msg
    });
      }.bind(this),
      error:function(err){
        console.log('notifications error');
      }.bind(this)
    });
    
  };

  componentWillMount=()=>{
    this.getNotification();

  };

  handleUnreadNotification=(url)=>{
   console.log(url+'/'+username);
    $.ajax({
     url:url+'/'+username,
     type:"GET",
     success:function (data) {
      console.log("*********"+data);
       if(data.response=="no data found"){
         alert('NO data For this Notification');
       }else{
         this.setState({
           data: data.msg
         });
         // console.log('**********************************');
       }
     }.bind(this),
     error:function(){
       console.log("error");
     }.bind(this)
    });
  };

  
  handleSearchText=(text)=>{
    alert(text);
  };


  render(){
    return(
      <div>
      <NotificationComponent notificationData={this.state.data}
      handleAcceptStatus={this.handleAccept} 
      fetchSelectedNotification={this.handleUnreadNotification}
      RecentNotification={this.getNotification}
      searchText={this.handleSearchText}
        
         />
       </div>
       
       );
    }
  }


// var a =ReactDOM.render(<MainComponent />,document.getElementById('app'));
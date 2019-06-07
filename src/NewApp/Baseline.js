import MyTabs from './MyTabs'
import SearchBar from './SearchBar'
import React from 'react'
import {Route} from 'react-router-dom'
import {Feed} from '../components/Tabs'
export default (props)=><div>
    <MyTabs/>
    <SearchBar/>
    <div>
      <Route exact path="/love" render={()=><Feed data={props.data}/>}/>
      <Route path="/call" render={()=><p>Call</p>}/>
    </div>
  </div>
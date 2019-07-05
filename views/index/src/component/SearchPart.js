import _ from 'lodash'
import React, { Component } from 'react'
import { Search,Button} from 'semantic-ui-react'
import $ from "jquery";

const initialState = { isLoading: false, results: [], value: '', open:false}
var baseUrl = {}

// http://127.0.0.1:4000
baseUrl.get = function (path) {
  return '' + path
}

let source = []

$.ajax({
  type: "get",
  url: baseUrl.get(`/search`),
  xhrFields: { withCredentials: true },
  dataType: "json",
  success: (data) => {
    data.forEach(e=> {
      source.push(
        {
          title: e.title,
          direcionName:e.direcionName,
          direcionNum:e.direcionNum
        }
      )
    });
    source = data;
  }
})




// const source = _.times(5, () => (
//   {
//     title: faker.company.companyName(),
//     description: faker.company.catchPhrase(),
//   }
// ))


export default class SearchExampleStandard extends Component {
  state = initialState

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title })
    this.props.historyByProps.push(`/BlogItems/${result.direcionName}/${result.direcionNum}`)
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value,open:true})

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState)

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch),
      })
    }, 300)
  }

  handleBlur(){
    if(this.state.value==""){
      this.setState({ open:false})
    }else{
      this.setState({ open:true})
    }
  }
  render() {
    const { isLoading, value, results,open} = this.state
    return (
      <div style={{ float: "right", marginRight: "1rem" }}
      >
        <Search
          open={open}
          onBlur={()=>{this.handleBlur()}}
          fluid
          size="small"
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={_.debounce(this.handleSearchChange, 500, {
            leading: true,
          })}
          results={results}
          value={value}
          {...this.props}
        />
      </div>
    )
  }
}
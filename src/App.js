import React from 'react';
import './App.css';
import axios from 'axios'

const TITLE = 'React GraphQL Github Client'

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`
  }
})

// const GET_ORGANIZATION = `
//   {
//     organization(login: "the-road-to-learn-react") {
//       name
//       url
//     }
//   }
// `
const GET_ISSUES_OF_REPO = `
  {
    organization(login: "the-road-to-learn-react") {
      name
      url
      repository(name: "the-road-to-learn-react") {
        name
        url
        issues(last: 5) {
          edges {
            node {
              id
              title
              url
            }
          }
        }
      }
    }
  }
`

class App extends React.Component {
  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
    organization: null,
    errors: null
  }

  componentDidMount() {
    this.onFetchFromGithub()
  }

  onFetchFromGithub = () => {
    axiosGitHubGraphQL
      .post('', { query: GET_ISSUES_OF_REPO })
      .then(result => {
        console.log(result)
        this.setState({
          organization: result.data.data.organization,
          errors: result.data.errors
        })
      })
  }

  onChange = e => {
    this.setState({
      path: e.target.value
    })
  }
  onSubmit = e => {
    e.preventDefault()
  }

  render() {
    return (
      <div>
        <h1>{TITLE}</h1>
        <form onSubmit={this.onSubmit}>
          <label htmlFor="url">
            Show open issues for https://github.com:
          </label>
          <br />
          <input 
            type="text"
            id="url"
            value={this.state.path}
            onChange={this.onChange}
            style={{ width: '300px' }}
          />
          <button type="submit">Search</button>
        </form>
        <hr />
        {
          this.state.organization ? (
            <Organization organization={this.state.organization} errors={this.state.errors} />
          ) : (
            <p>No info yet...</p>
          )
        }
        
      </div>
    )
  }
}

const Organization = ({ organization, errors }) => {
  if (errors) {
    return (
      <p>
        <strong>Something went wrong:</strong>
        {errors.map(error => error.message).join(' ')}
      </p>
    )
  }
  return (
    <div>
      <p>
        <strong>Issues from Organization:</strong>
        <a href={organization.url}>{organization.name}</a>
      </p>
      <Repository repository={organization.repository} />
    </div>
  )
}

const Repository = ({ repository }) => {
  return (
    <div>
      <p>
        <strong>In repository:</strong>
        <a href={repository.url}>{repository.name}</a>
      </p>
      <ul>
        {repository.issues.edges.map(issue => {
          return (
            <li key={issue.node.id}>
              <a href={issue.node.url}>{issue.node.title}</a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default App;

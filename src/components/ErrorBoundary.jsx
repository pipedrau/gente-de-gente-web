import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h1>Algo salió mal</h1>
          <p>Ocurrió un error inesperado. Por favor recarga la página.</p>
          <a className="btn-dark" href="/">Volver al inicio</a>
        </div>
      )
    }
    return this.props.children
  }
}

import React from "react"

type ErrorBoundaryState = {
  hasError: boolean
}

export default class ErrorBoundary extends React.Component<
  {},
  ErrorBoundaryState
> {
  constructor(props: {}) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <h5>Something went wrong - try again later</h5>
    }
    return this.props.children
  }
}

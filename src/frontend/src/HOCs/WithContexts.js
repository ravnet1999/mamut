import React from 'react';

export const WithContext = Component => Context => {
  return props => {
    return (
      <Context.Consumer>
        {(context) => {
          return <Component {...props} {...context}/>
        }}
      </Context.Consumer>
    )
  }
};

export const WithContexts = (Component, Contexts) => {    
  let Context = Contexts.pop();

  if(Contexts.length === 0) {
    return WithContext(Component)(Context);
  }

  return WithContext(WithContexts(Component, Contexts))(Context);
};
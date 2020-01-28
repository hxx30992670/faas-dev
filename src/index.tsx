import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import store from './store'

if ((module as any).hot) {
	(module as any).hot.accept(() => {
		ReactDOM.render(
			<AppContainer>
				<Provider store={store}>
					<Router>
						<App />
					</Router>
				</Provider>
			</AppContainer>,
			document.getElementById('root') as HTMLElement
		);
	});
}
ReactDOM.render(
	<AppContainer>
		<Provider store={store}>
			<Router>
				<App />
			</Router>
		</Provider>
	</AppContainer>,
	document.getElementById('root') as HTMLElement
);



registerServiceWorker();


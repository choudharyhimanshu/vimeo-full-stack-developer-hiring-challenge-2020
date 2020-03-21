import React from 'react';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './css/helper.css';
import './App.css';

import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';

import { ISearchItem } from './models/search-item';

import searchService from './services/search.service';

interface IAppState {
    isLoading: boolean;
    items: ISearchItem[];
    sortKey?: string;
    sortOrder?: number;
    sortField?: string;
}

class App extends React.Component<{}, IAppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            items: [],
            isLoading: false
        };

        this.onSortChange = this.onSortChange.bind(this);
    }

    onSortChange(event: any) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.setState({
                sortOrder: -1,
                sortField: value.substring(1, value.length),
                sortKey: value
            });
        } else {
            this.setState({
                sortOrder: 1,
                sortField: value,
                sortKey: value
            });
        }
    }

    fetchItems() {
        this.setState({ isLoading: true }, () => {
            searchService.fetchAllItems().then(response => {
                setTimeout(() => {
                    this.setState({ isLoading: false, items: response });
                }, 1000);
            });
        });
    }

    componentDidMount() {
        this.fetchItems();
    }

    renderHeader() {
        const sortOptions = [
            { label: 'Newest First', value: 'id' },
            { label: 'Oldest First', value: '!id' }
        ];

        return (
            <div className="p-grid">
                <div className="p-col-6" style={{ textAlign: 'left' }}>
                    <Dropdown
                        options={sortOptions}
                        value={this.state.sortKey}
                        placeholder="Sort By"
                        onChange={this.onSortChange}
                    />
                </div>
            </div>
        );
    }

    render() {
        const { isLoading, items, sortOrder, sortField } = this.state;

        const itemRenderer = (item: ISearchItem) => (
            <div>
                <h4>{item.id}</h4>
                <h5>{item.name}</h5>
                <hr />
            </div>
        );

        return (
            <div className="p-grid">
                <div className="p-sm-12 p-md-12 p-lg-6 p-lg-offset-3">
                    {isLoading ? (
                        <div className="text-center pt-5 pb-5">
                            <ProgressSpinner
                                style={{ width: '50px', height: '50px' }}
                                strokeWidth="5"
                            />
                        </div>
                    ) : (
                        <DataView
                            header={this.renderHeader()}
                            value={items}
                            layout="list"
                            itemTemplate={itemRenderer}
                            paginatorPosition={'both'}
                            paginator={true}
                            rows={10}
                            sortOrder={sortOrder}
                            sortField={sortField}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default App;

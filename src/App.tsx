import React from 'react';

import 'semantic-ui-css/semantic.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './css/helper.css';
import './App.css';

import { DataView } from 'primereact/dataview';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import { Growl } from 'primereact/growl';

import { ISearchItem } from './models/search-item';

import searchService from './services/search.service';
import SearchListItem from './components/SearchListItem';
import { Breadcrumb } from 'semantic-ui-react';

interface IAppState {
    isLoading: boolean;
    items: ISearchItem[];
    sortKey?: string;
    sortOrder?: number;
    sortField?: string;
}

class App extends React.Component<{}, IAppState> {
    growl: any;

    constructor(props: {}) {
        super(props);

        this.state = {
            items: [],
            isLoading: false,
            sortKey: '!transactionDate',
            sortField: 'transactionDate',
            sortOrder: -1
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
            searchService
                .fetchAllItems()
                .then(response => {
                    setTimeout(() => {
                        this.setState({ isLoading: false, items: response });
                    }, 1000);
                })
                .catch(error => {
                    this.growl.show({
                        severity: 'error',
                        summary: 'Error occurred fetching statement',
                        detail: error.toString()
                    });
                    this.setState({ isLoading: false });
                });
        });
    }

    componentDidMount() {
        this.fetchItems();
    }

    renderHeader() {
        const sortOptions = [
            { label: 'Oldest Transactions', value: 'transactionDate' },
            { label: 'Newest Transactions', value: '!transactionDate' },
            { label: 'Withdraw Amount', value: '!withdrawAmount' },
            { label: 'Deposit Amount', value: '!depositAmount' }
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
        const accountNo = items.length > 0 ? items[0].accountNo : undefined;

        return (
            <div className="p-grid pt-5 pb-5">
                <Growl ref={el => (this.growl = el)}></Growl>
                <div className="p-sm-12 p-md-12 p-lg-6 p-lg-offset-3">
                    {isLoading ? (
                        <div className="text-center pt-5 pb-5">
                            <ProgressSpinner
                                style={{ width: '50px', height: '50px' }}
                                strokeWidth="5"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="p-grid pt-5 pb-5">
                                <div className="p-col-12">
                                    <Breadcrumb size="big">
                                        <Breadcrumb.Section link>
                                            Home
                                        </Breadcrumb.Section>
                                        <Breadcrumb.Divider icon="right chevron" />
                                        <Breadcrumb.Section>
                                            Account Statement
                                        </Breadcrumb.Section>
                                        <Breadcrumb.Divider icon="right arrow" />
                                        <Breadcrumb.Section active>
                                            {accountNo}
                                        </Breadcrumb.Section>
                                    </Breadcrumb>
                                </div>
                            </div>
                            <div className="p-grid">
                                <DataView
                                    className="w-full"
                                    header={this.renderHeader()}
                                    value={items}
                                    layout="list"
                                    itemTemplate={SearchListItem}
                                    paginatorPosition={'both'}
                                    paginator={true}
                                    rows={10}
                                    sortOrder={sortOrder}
                                    sortField={sortField}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

export default App;

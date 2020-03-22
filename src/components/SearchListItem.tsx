import React from 'react';
import { ISearchItem } from '../models/search-item';

import { Item, Label, Header, Divider } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import Moment from 'react-moment';

const SearchListItem = (item: ISearchItem) => {
    return (
        item && (
            <Item className="pt-2 pl-2 pr-2">
                <Item.Content>
                    <Item.Header as="h3" className="xs-h3">
                        {item.transactionDetails}
                        <Label className="pull-right" basic>
                            <Moment date={item.transactionDate} format="LL" />
                        </Label>
                    </Item.Header>
                    <Item.Meta className="pb-2">
                        Value Date: <Moment date={item.valueDate} format="LL" />
                    </Item.Meta>
                    <Item.Extra>
                        <Header as="h4" floated="left">
                            Available Balance:{' '}
                            <NumberFormat
                                style={{ color: '#2185d0' }}
                                value={item.balanceAmount}
                                displayType={'text'}
                                thousandSeparator={true}
                                thousandsGroupStyle="lakh"
                                prefix={'₹'}
                            />
                        </Header>
                        {item.withdrawAmount > 0 && (
                            <Header as="h4" floated="right" color="red">
                                <NumberFormat
                                    value={item.withdrawAmount}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    thousandsGroupStyle="lakh"
                                    prefix={'- ₹'}
                                />
                            </Header>
                        )}
                        {item.depositAmount > 0 && (
                            <Header as="h4" floated="right" color="green">
                                <NumberFormat
                                    value={item.depositAmount}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    thousandsGroupStyle="lakh"
                                    prefix={'+ ₹'}
                                />
                            </Header>
                        )}
                    </Item.Extra>
                </Item.Content>
                <Divider clearing className="mb-0" />
            </Item>
        )
    );
};

export default SearchListItem;

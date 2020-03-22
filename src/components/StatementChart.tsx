import React from 'react';
import { ISearchItem } from '../models/search-item';
import { Chart } from 'primereact/chart';

export interface IStatementChartProps {
    items: ISearchItem[];
}

const StatementChart = (props: IStatementChartProps) => {
    const { items } = props;

    const availableBalanceData = items
        ? {
              labels: items.map(item =>
                  item.transactionDate.toLocaleDateString('en-US')
              ),
              datasets: [
                  {
                      label: 'Available Balance',
                      data: items.map(item => item.balanceAmount),
                      fill: false,
                      backgroundColor: '#42A5F5',
                      borderColor: '#42A5F5'
                  }
              ]
          }
        : [];

    const transactionCategoryData = {
        labels: ['Deposits', 'Withdraws'],
        datasets: [
            {
                data: [
                    items.filter(item => item.depositAmount > 0).length,
                    items.filter(item => item.withdrawAmount > 0).length
                ],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384']
            }
        ]
    };

    return (
        <div className="text-center">
            <Chart type="line" data={availableBalanceData} />
            <Chart className="mt-5" type="pie" data={transactionCategoryData} />
        </div>
    );
};

export default StatementChart;

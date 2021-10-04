import React from 'react';
import { Table } from 'antd';

const BaseTable = (props) => (
    <Table
        className="base-table"
        size="middle"
        scroll={{ x: true }}
        // scroll={{ x: 'max-content' }}
        {...props}
        pagination={{ ...props.pagination, showSizeChanger: false, hideOnSinglePage: true }}
    />
)

export default BaseTable;
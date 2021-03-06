import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import styled from 'styled-components'

import MjColumn from '../../models/MjModels/MjColumn'
import ConstructPreviewComponent from '../../factory/ConstructPreviewComponent'
import EmptyColumn from '../../lib/dnd/components/Drop/EmptyColumn'
import Empty from './Empty'

const SCLayoutColumn = styled.div`
    :hover {
        ::before {
            opacity: 1;
        }
    }
    ::before {
        content: '';
        display: block;
        position: absolute;
        z-index: 10001;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        border: 1px dashed #eaeef0;
        transition: 0.2s opacity linear;
        pointer-events: none;
    }
`

const mapStateToProps = (state, ownProps) => {
    const column = _.assignIn(new MjColumn(), ownProps.column)

    return {
        column: column,
        components: _.chain(state.Templating.components)
            .filter({
                keySection: ownProps.keySection,
                keyColumn: column.getKey()
            })
            .orderBy('order', 'asc')
            .value()
    }
}

@connect(mapStateToProps)
export class Column extends Component {
    render() {
        const { column, components, keySection } = this.props

        return (
            <SCLayoutColumn style={column.getStylePreview()}>
                {_.isEmpty(components) || _.isUndefined(components) ? (
                    <EmptyColumn column={column}>
                        <Empty column={column} />
                    </EmptyColumn>
                ) : (
                    components.map((component, key) => {
                        return ConstructPreviewComponent(component, key)
                    })
                )}
            </SCLayoutColumn>
        )
    }
}

Column.propTypes = {
    components: PropTypes.array,
    keySection: PropTypes.number.isRequired,
    column: PropTypes.object.isRequired
}

export default Column

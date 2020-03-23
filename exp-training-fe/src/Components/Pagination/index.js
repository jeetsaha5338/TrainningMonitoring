import React, {Fragment, Component } from 'react';
import './pagination.css';

export default class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: props.currentPage || 1
        }
        
    }

    onPageLengthChange = (e) => {
        this.props.onPageLengthChange(this.pageLengthInput.value);
        this.setState({ currentPage : 1})
    }

    onPrevPage = (e) => {
        if (this.state.currentPage === 1) return;
        this.onGotoPage(this.state.currentPage - 1);
    }

    onNextPage = (e) => {
        if (this.state.currentPage > this.pages - 1) return;
        this.onGotoPage(this.state.currentPage + 1);
    }

    onGotoPage = (pageNo) => {
        if (pageNo === this.state.currentPage) {
            return;
        }
        if (this.currentPageInput) {
            this.currentPageInput.value = pageNo;
        }

        this.setState({
            currentPage: pageNo
        });

        this.props.onGotoPage(pageNo);
    }
      
    _getPaginationButtons = (text) => {
        let classNames = 'btn btn-light';
        
        // May need refactor
        if (this.state.currentPage === text) {
            classNames = 'btn btn-secondary';
        }

        let html = (
            <button key={`btn-${text}`}
                id={`btn-${text}`}
                className={classNames}
                onClick={(e)=>{this.onGotoPage(text)}}
            >{text}
            </button>
        );
        return html;
    }

    onCurrentPageChange = (e) => {
        if (this.currentPageInput.value >= this.pages) {
            this.currentPageInput.value = this.pages;
        }
        this.setState({
            currentPage: this.currentPageInput.value
        });

        this.props.onGotoPage(this.currentPageInput.value);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.currentPage !== prevState.currentPage) {
            return {
               currentPage: nextProps.currentPage 
            }
        }
        return null;
    }

    render() {
        let {totalRecords,pageLength} = this.props;
        let { currentPage } = this.state;
        let pages = Math.ceil(totalRecords / pageLength);
        this.pages = pages;

        let pageSelector = (
            <Fragment key="f-page-selector">
                <span key="page-selector" className="page-selector">
                    Rows per page -
                    <input key="page-input"
                      type="number"
                      min="1"
                      ref={(input)=>this.pageLengthInput = input}
                      defaultValue={pageLength || 5}
                      onChange={this.onPageLengthChange}
                    />
                    - Showing <b>{(currentPage-1)*pageLength+1} 
                    - {(currentPage*pageLength > totalRecords)? totalRecords : currentPage*pageLength}
                    </b> of <b>{totalRecords}</b> Records
                </span>
            </Fragment>
        );

        let prevButton = (
            <button key="prev"
                className="btn btn-dark"
                onClick={this.onPrevPage}>
                {"< Previous"}
            </button>

        );

        let nextButton = (
            <button key="next"
                className="btn btn-dark"
                onClick={this.onNextPage}>
                {"Next >"}
            </button>

        );

        let buttons = [];
        if (this.props.type === "short" || (this.props.totalRecords/this.props.pageLength) > 15) {
            buttons.push(
                <input key="currentPageInput"
                    className="current-page-input"
                    type="number"
                    max={this.pages}
                    defaultValue={this.state.currentPage}
                    ref={(input)=>{this.currentPageInput=input}}
                    onChange={this.onCurrentPageChange} />
            );
        }else if (this.props.type === "long") {
            for(let i = 1; i <= pages; i++) {
                buttons.push(this._getPaginationButtons(i));
            }
        }

        return (
            <div className="pagination">
            {
                [pageSelector, prevButton, buttons, nextButton]
            }
            </div>
        );
    }
}
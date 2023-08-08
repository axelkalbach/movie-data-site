import React, { useState, useEffect } from 'react';
import { Card, Image } from 'semantic-ui-react'

import './SearchBar.css'

function SearchBar() {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchData, setSearchData] = useState([]);
	const [storedData, setStoredData] = useState([]);
	const [searchExact, setSearchExact] = useState(false);
	const [previousDisabled, setPreviousDisabled] = useState(true);
	const [nextDisabled, setNextDisabled] = useState(true);
	const [currentPage, setCurrentPage] = useState(0);

	useEffect(() => {
		handleSearch()
	}, [searchTerm]);

	const handleInputChange = (event) => {
		console.log(event.target.value)
		setSearchTerm(event.target.value)
	};

	const handleExactChange = (event) => {
		console.log(event.target.checked)
		setSearchExact(event.target.checked);
	};

	const handleNext = async () => {
		if (storedData.length < currentPage + 1) {
			var data = await pingSearchAPI(searchTerm, currentPage + 1, searchExact)
			setSearchData(data.results)
			storedData.push(data.results)
			setNextDisabled(!data.next)
		}
		else {
			setSearchData(storedData[currentPage])
		}
		setCurrentPage(currentPage + 1)
		setPreviousDisabled(false)
	};

	const handlePrevious = () => {
		setSearchData(storedData[currentPage - 2])
		setNextDisabled(false)
		console.log("page", currentPage)
		setPreviousDisabled(currentPage == 2)
		setCurrentPage(currentPage - 1)
		console.log("after previous", storedData)
		console.log("after previous", searchData)

	};

	const handleSearch = async () => {
		if (searchTerm) {
			var data = await pingSearchAPI(searchTerm, 1, searchExact)
			setSearchData(data.results)
			setNextDisabled(!data.next)
			setStoredData([data.results])
			console.log("storeddata", storedData)
			setCurrentPage(1)
		}
		else {
			console.log('blank search term')
		}
	};

	const pingSearchAPI = async (searchTerm, pageNum=1, exact=false, titleType="tvSeries") => {
		const url = `https://moviesdatabase.p.rapidapi.com/titles/search/title/${searchTerm}?exact=${exact}&titleType=${titleType}&page=${pageNum}`;
		const options = {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': '4d3e93a9cemsh64389c0fd97a80dp15af3fjsn62e2761706d6',
				'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
			}
		};
		console.log(searchTerm)
		const response = await fetch(url, options)
		const data = await response.json()
		console.log("data in ping:")
		console.log(data);
		return data
	}

	const getImageUrl = (item) => {
		if (item.primaryImage) {
			return item.primaryImage["url"]
		}
		else {
			return ""
		}
	}

	const getYears = (item) => {
		if (item.releaseYear) {
			const startYear = item.releaseYear["year"]
			if (item.releaseYear["endYear"]) {
				return `${startYear}-${item.releaseYear["endYear"]}`
			}
			else {
				return `${ startYear }-`
			}
		}
		else {
			return "N/A"
		}
	}

	const clearSearchData = () => {
		setSearchData([])
		setStoredData([])
		setCurrentPage(0)
	}

	return (
		<div>
			<nav className="navbar navbar-light bg-light">
				<div className="container-fluid">
					<div className="align-center d-flex">
						<div className="pe-2">
							<h1><a href="/">MovieData</a></h1>
						</div>
						<input 
							className="form-control me-2" 
							type="search" 
							placeholder="Search" 
							aria-label="Search" 
							value={searchTerm}
							onChange={handleInputChange}>
						</input>
						<button className="btn btn-outline-success me-2" onClick={handleSearch}>Search</button>
						<div class="form-check form-switch d-flex ps-10">
							<input
								class="form-check-input"
								type="checkbox"
								id="flexSwitchCheckDefault"
								onChange={handleExactChange}>
							</input>
						</div>
						<label>Exact</label>
					</div>
				</div>
			</nav>
			{currentPage > 0 &&
				<div className="search-results">
					<div className="mb-3">
						<Card.Group itemsPerRow={5} style={{ marginTop: 20 }}>
							{searchData.map((item) => {
								return (
									<Card>
										<a href={`series/${item.id}`}>
											<Card.Content>
												<Card.Header>{item.titleText["text"]}</Card.Header>
												<img src={getImageUrl(item)} height="100" />
												<Card.Description>
													{getYears(item)}
												</Card.Description>
											</Card.Content>
										</a>
									</Card>
								)
							})}
						</Card.Group>
					</div>
					<div className="container-fluid d-flex container">
						<div>
							<button className="btn btn-primary me-2" onClick={handlePrevious} disabled={previousDisabled}>Previous</button>
						</div>
						<div>
							page {currentPage}
						</div>
						<div>
							<button className="btn btn-primary me-2" onClick={handleNext} disabled={nextDisabled}>Next</button>
						</div>
						
					</div>
				</div>
			}
		</div>
	);
}

export default SearchBar;
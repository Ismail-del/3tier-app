package com.example.beer.beerhandle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.beer.beerhandle.model.Beer;

@Repository
public interface BeerRepository extends JpaRepository<Beer, Long> {

}
package com.example.beer.beerhandle.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

import com.example.beer.beerhandle.exception.ResourceNotFoundException;
import com.example.beer.beerhandle.model.Beer;
import com.example.beer.beerhandle.repository.BeerRepository;

@RestController
@RequestMapping("/api/beers")
public class BeerController {

  @Autowired
  private BeerRepository beerRepository;

  @GetMapping
  public List<Beer> getAllBeers() {
    return beerRepository.findAll();
  } 

  @GetMapping("/{id}")
  public Beer getBeerById(@PathVariable Long id) {
    return beerRepository.findById(id).get();
  }
  
  @PostMapping
  public Beer createBeer(@RequestBody Beer beer) {
    return beerRepository.save(beer);
  }

  @PutMapping("/{id}")
  public Beer updateBeer(@PathVariable Long id, @RequestBody Beer beer) {
    Beer existingBeer = beerRepository.findById(id).get();
    existingBeer.setName(beer.getName());
    existingBeer.setRate(beer.getRate());
    return beerRepository.save(existingBeer);
  }

  @DeleteMapping("/{id}")
  public String deleteBeer(@PathVariable Long id) {
    try {
      beerRepository.findById(id).get();
      beerRepository.deleteById(id);
      return "Beer deleted successfully";
    } catch (Exception e) {
      return "Beer not found";
    }
  }
}
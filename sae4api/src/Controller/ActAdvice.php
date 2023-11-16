<?php

namespace App\Controller;

use App\Entity\Advice;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class ActAdvice extends AbstractController
{
  public function __invoke(Advice $data): JSONResponse
  {
    $data->setActed(true);
    $this->getDoctrine()->getManager()->persist($data);
    $this->getDoctrine()->getManager()->flush();
    return JsonResponse::create($data);
  }
}